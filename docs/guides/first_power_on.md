# First Power-On Checklist

<form name="power-on">
<ul class="task-list">
    <li class="task-list-item"><label class="task-list-control"><input type="checkbox"/><span class="task-list-indicator"></span>Woop</label></li>
</ul>

</form>

<script>
document.querySelectorAll("form").forEach(f => {
    f.addEventListener("change", (e) => {
        console.log(e);
    })
});
</script>